import '../data/areas.dart';
import 'donor.dart';

enum RequestStatus { pending, accepted, declined }

/// One donor who has been asked for a particular request.
class DonorResponse {
  final Donor donor;
  final double distanceKm;
  RequestStatus status = RequestStatus.pending;

  DonorResponse(this.donor, this.distanceKm);
}

class BloodRequest {
  final String bloodGroup;
  final int units;
  final String hospital;
  final Area area;
  final String urgency;
  final String contact;
  final DateTime createdAt;
  final List<DonorResponse> responses = [];

  BloodRequest({
    required this.bloodGroup,
    required this.units,
    required this.hospital,
    required this.area,
    required this.urgency,
    required this.contact,
  }) : createdAt = DateTime.now();

  DonorResponse? responseFor(Donor d) {
    for (final r in responses) {
      if (identical(r.donor, d)) return r;
    }
    return null;
  }
}
