# Site build dependencies

The site is built in GitHub Actions and uploaded to Pages as static HTML. GitHub Pages does not choose the Jekyll version for this deployment.

- `Gemfile` declares Jekyll `~> 4.4.1` (4.4.x patch releases).
- `Gemfile.lock` records the exact resolved version, currently 4.4.1.
- CI and deployment both use this root Gemfile and lockfile.
- `.github/dependabot.yml` checks Bundler updates daily and opens update PRs.

The fixtures for the upstream theme's Jekyll and github-pages gem compatibility tests are not used to build this site. The github-pages gem can select older Jekyll and Ruby Sass versions; its compatibility job has been removed from this site's CI.

To update within the allowed range, run `bundle update jekyll`, then `bundle exec jekyll build` and `npm test`. Commit the updated lockfile. To adopt a new minor or major release, change the Gemfile constraint first and review plugin compatibility.

SCSS uses the alpha aliases (`rgba`) with Stylelint's `with-alpha` rule, which also preserves compatibility with Ruby Sass.
