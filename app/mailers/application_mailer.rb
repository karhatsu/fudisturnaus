class ApplicationMailer < ActionMailer::Base
  default from: "info@#{DOMAIN}"
  layout 'mailer'
end
