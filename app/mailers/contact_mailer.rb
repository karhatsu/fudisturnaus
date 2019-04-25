class ContactMailer < ApplicationMailer
  def contact_email(name, contact_info, message, tournament)
    @name = name
    @contact_info = contact_info
    @message = message
    @tournament = tournament
    mail to: ENV['EMAIL_ADDRESS'], subject: "#{DOMAIN} - yhteydenotto"
  end
end
