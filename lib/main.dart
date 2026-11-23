import 'package:flutter/material.dart';

import 'screens/login_screen.dart';
import 'services/app_state.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppState.instance.load();
  runApp(const RaktSetuApp());
}

class RaktSetuApp extends StatelessWidget {
  const RaktSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RaktSetu',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFC62828)),
        useMaterial3: true,
      ),
      // Keeps the app phone-width when opened on a laptop browser.
      builder: (context, child) => Container(
        color: const Color(0xFFE0E0E0),
        alignment: Alignment.topCenter,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 480),
          child: child,
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
