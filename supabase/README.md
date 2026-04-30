# Supabase Setup

Run `articles-schema.sql` in the Supabase SQL editor for this project.

The schema creates `public.articles`, indexes, an `updated_at` trigger, and RLS policies:

- anonymous users can read published articles
- authenticated users can create, update, and delete articles from the admin panel

After the SQL runs, `/admin/articles/new` will persist articles to Supabase and the public site will read published articles from Supabase.
