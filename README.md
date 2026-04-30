# cavemen-africa

Static site and **PHP APIs** for shared hosting (cPanel + Apache). There is no Node.js backend in this tree.

## Deploy to cPanel

From the repository root:

```bash
npm run package:cpanel
```

Upload the **contents** of `dist-cpanel-php/` to your document root (e.g. `public_html/`), then on the server:

```bash
composer install --no-dev --optimize-autoloader
```

Configure MySQL and API keys in a new `.env` on the server (do not copy a local secrets file blindly). See `site/sql/schema-mysql.sql` for the database layout.

## Local preview (optional)

Serve the `site/` folder with PHP’s built-in server from inside `site/`:

```bash
cd site && php -S localhost:8080
```

Apache rewrite rules for `/api/*` live in `site/.htaccess`; production on cPanel should use Apache, not the PHP CLI server, for full behavior.
