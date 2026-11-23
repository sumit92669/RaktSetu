class Donor {
  final String name;
  final String bloodGroup;
  final String area;
  final String phone;
  DateTime? lastDonation; // null = never donated

  Donor({
    required this.name,
    required this.bloodGroup,
    required this.area,
    required this.phone,
    this.lastDonation,
  });

  factory Donor.fromJson(Map<String, dynamic> j) => Donor(
        name: j['name'] as String,
        bloodGroup: j['bloodGroup'] as String,
        area: j['area'] as String,
        phone: j['phone'] as String,
        lastDonation: j['lastDonation'] == null
            ? null
            : DateTime.parse(j['lastDonation'] as String),
      );

  int? get daysSinceDonation => lastDonation == null
      ? null
      : DateTime.now().difference(lastDonation!).inDays;
}
