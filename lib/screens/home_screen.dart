import 'package:flutter/material.dart';

import '../services/app_state.dart';
import '../widgets/action_card.dart';
import 'donate_screen.dart';
import 'login_screen.dart';
import 'request_screen.dart';
import 'status_screen.dart';

/// Screen 2: Home with two big buttons.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = AppState.instance;
    return Scaffold(
      appBar: AppBar(
        title: const Text('RaktSetu'),
        actions: [
          IconButton(
            tooltip: 'Log out',
            icon: const Icon(Icons.logout),
            onPressed: () {
              app.logout();
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
                (r) => false,
              );
            },
          ),
        ],
      ),
      body: ListenableBuilder(
        listenable: app,
        builder: (context, _) {
          final user = app.currentUser;
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              Text(
                user == null ? 'Hello, guest' : 'Hello, ${user.name}',
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              const Text('Be the bridge between a donor and a patient.'),
              const SizedBox(height: 24),
              ActionCard(
                icon: Icons.volunteer_activism,
                title: 'Donate Blood',
                subtitle: 'Your donor profile and eligibility',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const DonateScreen()),
                ),
              ),
              ActionCard(
                filled: true,
                icon: Icons.bloodtype,
                title: 'Request Blood',
                subtitle: 'Find nearby, eligible donors',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const RequestScreen()),
                ),
              ),
              ActionCard(
                icon: Icons.list_alt,
                title: 'My Requests (${app.requests.length})',
                subtitle: 'Track replies from donors',
                onTap: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const StatusScreen()),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Demo app with sample data. Final eligibility screening is '
                'done by the hospital or blood bank. This is not medical advice.',
                style: TextStyle(fontSize: 12, color: Colors.black54),
                textAlign: TextAlign.center,
              ),
            ],
          );
        },
      ),
    );
  }
}
