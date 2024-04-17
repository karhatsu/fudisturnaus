class ContactMailer < ApplicationMailer
  def contact_email(contact)
    @contact = contact
    system_email = ENV['EMAIL_ADDRESS']
    reply_to = contact.email.index('@') ? contact.email : system_email
    subject = contact.tournament_name.blank? ? 'yhteydenotto' : contact.tournament_name
    mail to: system_email, reply_to: reply_to, subject: "#{DOMAIN} - #{subject}"
  end

  def system_email(subject, message)
    @message = message
    mail to: ENV['EMAIL_ADDRESS'], subject: subject
  end
end
