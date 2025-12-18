<!-- Login Page -->
<?php $page_name = "login"; ?>
<!-- Include header -->
<?php require_once __DIR__ . "/header.php"; ?>
<!-- Display login error if exists -->
<?php

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check and display login error message
if (!empty($_SESSION['login_error'])): ?>
    <p style="color:red; text-align:center;">
        <?= htmlspecialchars($_SESSION['login_error']); ?>
    </p>
    <?php
    unset($_SESSION['login_error']);
endif;
?>

<!-- Include login controller -->
<script src="/controller/login-controller.js"></script>

<!-- Login Form -->
<div class="login-container">
    <h2>Login</h2>

    <!-- Login form posting to index-controller.php -->
    <form action="controller/index-controller.php" method="POST" class="login-form">

        <!-- Username Field -->
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required>

        <!-- Password Field -->
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>

        <!-- Submit Button -->
        <button type="submit" class="login-btn">Login</button>
    </form>
</div>

<!-- Include footer -->
<?php require_once __DIR__ . "/footer.php"; ?>