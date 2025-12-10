<?php $page_name = "login"; ?>

<?php include "view/header.php"; ?>

<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!empty($_SESSION['login_error'])): ?>
    <p style="color:red; text-align:center;">
        <?= htmlspecialchars($_SESSION['login_error']); ?>
    </p>
    <?php
    unset($_SESSION['login_error']);
endif;
?>


<script src="controller/login-controller.js"></script>


<div class="login-container">
    <h2>Login</h2>

    <form action="controller/index-controller.php" method="POST" class="login-form">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required>

        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <button type="submit" class="login-btn">Login</button>
    </form>
</div>

<?php include "view/footer.php"; ?>