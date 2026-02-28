source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '4.0.1'

gem 'rails', '8.1.1'
# Use Puma as the app server
gem 'puma'
# Use SassC for stylesheets
gem 'sassc-rails'
gem 'terser'
gem 'jsbundling-rails'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

gem 'friendly_id'

gem 'rexml'

gem 'wicked_pdf'
gem 'viitenumero'

group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'dotenv-rails'
  gem 'wkhtmltopdf-binary'
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console'
  gem 'listen'
end

group :test do
  gem 'sqlite3'
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'launchy'
  gem 'mutex_m'
end

group :development, :production do
  gem 'pg'
end

group :production do
  gem 'redis'
  gem 'sendgrid-ruby'
  gem 'image_processing'
  gem 'wkhtmltopdf-heroku'
end
