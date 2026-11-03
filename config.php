<?php
declare(strict_types=1);
session_start();
$host = '127.0.0.1'; $db = 'study_planner'; $user = 'root'; $pass = '';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]);
} catch (PDOException $e) { http_response_code(500); exit('Дерекқорға қосылу мүмкін болмады. config.php параметрлерін тексеріңіз.'); }
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
function e(?string $s): string { return htmlspecialchars($s ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function csrf(): string { return '<input type="hidden" name="csrf" value="'.e($_SESSION['csrf']).'">'; }
function check_csrf(): void { if (!hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('Қате CSRF токені'); } }
function require_login(): void { if (empty($_SESSION['uid'])) { header('Location: login.php'); exit; } }
function redirect(string $to='index.php'): void { header('Location: '.$to); exit; }
