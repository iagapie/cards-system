## Deploy

```shell
$ composer install --no-dev --optimize-autoloader
$ echo "<?php return [];" > .env.local.php
```

### Local dev server

```shell
$ php -S localhost:8080 public/index.php
```
