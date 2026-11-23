import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart' show rootBundle;

import '../data/areas.dart';
import '../models/blood_request.dart';
import '../models/donor.dart';
import 'matching_service.dart';

/// Simple in-memory app state (no backend). Data resets on refresh.
class AppState extends ChangeNotifier {
  AppState._();
  static final AppState instance = AppState._();

  final List<Donor> donors = [];
  final List<BloodRequest> requests = [];
  Donor? currentUser; // null = guest

  Future<void> load() async {
    if (donors.isNotEmpty) return;
    final raw = await rootBundle.loadString('assets/data/donors.json');
    final list = jsonDecode(raw) as List<dynamic>;
    donors.addAll(
      list.map((e) => Donor.fromJson(e as Map<String, dynamic>)),
    );
  }

  void registerUser(Donor d) {
    donors.add(d);
    currentUser = d;
    notifyListeners();
  }

  void logout() {
    currentUser = null;
    notifyListeners();
  }

  void markDonatedToday() {
    currentUser?.lastDonation = DateTime.now();
    notifyListeners();
  }

  BloodRequest createRequest({
    required String bloodGroup,
    required int units,
    required String hospital,
    required Area area,
    required String urgency,
    required String contact,
  }) {
    final r = BloodRequest(
      bloodGroup: bloodGroup,
      units: units,
      hospital: hospital,
      area: area,
      urgency: urgency,
      contact: contact,
    );
    requests.add(r);
    notifyListeners();
    return r;
  }

  MatchResult match(BloodRequest r) =>
      MatchingService.findMatches(donors, r.bloodGroup, r.area,
          exclude: currentUser);

  void sendTo(BloodRequest r, Match m) {
    if (r.responseFor(m.donor) != null) return;
    r.responses.add(DonorResponse(m.donor, m.distanceKm));
    notifyListeners();
  }

  void respond(DonorResponse resp, RequestStatus status) {
    resp.status = status;
    notifyListeners();
  }
}
