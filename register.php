<?php require 'config.php'; if (!empty($_SESSION['uid'])) redirect(); $error='';
if ($_SERVER['REQUEST_METHOD']==='POST') { check_csrf(); $name=trim($_POST['name']??''); $email=trim($_POST['email']??''); $password=$_POST['password']??'';
 if (mb_strlen($name)<2 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($password)<8) $error='Атыңызды, дұрыс email және кемінде 8 таңбалы құпиясөз енгізіңіз.';
 else { try { $stmt=$pdo->prepare('INSERT INTO users(name,email,password_hash) VALUES(?,?,?)'); $stmt->execute([$name,$email,password_hash($password,PASSWORD_DEFAULT)]); session_regenerate_id(true); $_SESSION['uid']=(int)$pdo->lastInsertId(); redirect(); } catch(PDOException $e) { $error='Бұл email тіркелген болуы мүмкін.'; } }
}
require 'header.php'; ?><section class="panel narrow"><h1>Тіркелу</h1><?php if($error): ?><p class="error"><?=e($error)?></p><?php endif; ?><form method="post"><?=csrf()?><label>Аты<input name="name" required maxlength="100"></label><label>Email<input name="email" type="email" required></label><label>Құпиясөз<input name="password" type="password" required minlength="8"></label><button>Тіркелу</button></form></section><?php require 'footer.php'; ?>
