<?php
$body = json_decode(file_get_contents("php://input"), true);

if (!is_array($body)) {
    http_response_code(400);
    die();
}


$value = 0;

foreach ($body as $key => $value) {
    if (filter_var($value, FILTER_VALIDATE_INT) !== false) {
        echo ("Variable is an integer ");
    } else {
        echo ("Variable is not an integer ");
    }

}


$sum = 0;
foreach ($body as $value) {
    if (!is_numeric(($value))) {
        continue;
    }

    $sum += $value;
}

echo $sum;
?>