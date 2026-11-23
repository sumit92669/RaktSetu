/// Delhi areas with approximate coordinates (used for distance ranking).
class Area {
  final String name;
  final double lat;
  final double lng;
  const Area(this.name, this.lat, this.lng);
}

const List<Area> delhiAreas = [
  Area('Chandni Chowk', 28.6506, 77.2303),
  Area('Connaught Place', 28.6315, 77.2167),
  Area('Dwarka', 28.5921, 77.0460),
  Area('Hauz Khas', 28.5494, 77.2001),
  Area('Janakpuri', 28.6219, 77.0878),
  Area('Karol Bagh', 28.6519, 77.1909),
  Area('Lajpat Nagar', 28.5677, 77.2433),
  Area('Laxmi Nagar', 28.6304, 77.2773),
  Area('Mayur Vihar', 28.6082, 77.2950),
  Area('Nehru Place', 28.5491, 77.2533),
  Area('Pitampura', 28.7005, 77.1318),
  Area('Rohini', 28.7495, 77.0565),
  Area('Saket', 28.5245, 77.2066),
  Area('Vasant Kunj', 28.5200, 77.1590),
];

Area areaByName(String name) {
  return delhiAreas.firstWhere(
    (a) => a.name == name,
    orElse: () => delhiAreas.first,
  );
}
