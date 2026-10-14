# Validate this build's own URLs locally, including canonical and redirect links.
require "html-proofer"
require "yaml"
require "uri"

config = YAML.load_file(File.expand_path("../_config.yml", __dir__))
origin = URI.parse(config.fetch("url"))
raise "site.url must be an HTTP(S) origin" unless %w[http https].include?(origin.scheme) && origin.host

# Match a complete authority, not similarly named external domains.
authority = Regexp.escape(origin.authority)
same_origin = %r{\Ahttps?://#{authority}(?=/|\z)}i
options = {
  swap_urls: { same_origin => "" },
  ignore_urls: [/github.com/, /web.archive.org/],
  # Local environments may lack external network access; CI keeps it enabled.
  disable_external: ARGV.delete("--internal-only") != nil,
}
HTMLProofer.check_directory(ARGV.fetch(0, "_site"), options).run
