import 'dart:math';

import '../data/areas.dart';
import '../models/donor.dart';

/// Who can donate to whom (red blood cells).
/// Key = donor group, value = recipient groups that can receive it.
const Map<String, List<String>> canDonateTo = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

/// Minimum gap between whole-blood donations (configurable default).
/// Verify against official guidelines before real use.
const int minGapDays = 90;

final List<String> bloodGroups = canDonateTo.keys.toList();

class Match {
  final Donor donor;
  final double distanceKm;
  final bool exactGroup;
  Match(this.donor, this.distanceKm, this.exactGroup);
}

class MatchResult {
  final List<Match> matches;
  final int compatibleButIneligible;
  MatchResult(this.matches, this.compatibleButIneligible);
}

class MatchingService {
  /// Step 1: can this donor's group be given to the recipient group?
  static bool isCompatible(Donor d, String recipientGroup) =>
      canDonateTo[d.bloodGroup]!.contains(recipientGroup);

  /// Step 2: donated at least [minGapDays] ago (or never).
  static bool isEligible(Donor d) {
    final days = d.daysSinceDonation;
    return days == null || days >= minGapDays;
  }

  static DateTime? nextEligibleDate(Donor d) => d.lastDonation == null
      ? null
      : d.lastDonation!.add(const Duration(days: minGapDays));

  /// Step 3: rank by distance from the hospital area (nearest first).
  static MatchResult findMatches(
    List<Donor> donors,
    String recipientGroup,
    Area hospitalArea, {
    Donor? exclude,
  }) {
    final matches = <Match>[];
    var ineligible = 0;
    for (final d in donors) {
      if (exclude != null && identical(d, exclude)) continue;
      if (!isCompatible(d, recipientGroup)) continue;
      if (!isEligible(d)) {
        ineligible++;
        continue;
      }
      final a = areaByName(d.area);
      final km = _haversineKm(hospitalArea.lat, hospitalArea.lng, a.lat, a.lng);
      matches.add(Match(d, km, d.bloodGroup == recipientGroup));
    }
    matches.sort((a, b) {
      final c = a.distanceKm.compareTo(b.distanceKm);
      if (c != 0) return c;
      // Tie-break: exact group match first.
      return (b.exactGroup ? 1 : 0).compareTo(a.exactGroup ? 1 : 0);
    });
    return MatchResult(matches, ineligible);
  }

  static double _haversineKm(double lat1, double lon1, double lat2, double lon2) {
    const r = 6371.0;
    double rad(double d) => d * pi / 180;
    final dLat = rad(lat2 - lat1);
    final dLon = rad(lon2 - lon1);
    final h = pow(sin(dLat / 2), 2) +
        cos(rad(lat1)) * cos(rad(lat2)) * pow(sin(dLon / 2), 2);
    return 2 * r * asin(sqrt(h));
  }
}
