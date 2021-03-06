class ContactMailer < ApplicationMailer
  def contact_email(name, contact_info, message, tournament_organizer, tournament_name, tournament_start_date, tournament_days, tournament_location)
    @name = name
    @contact_info = contact_info
    @message = message
    @tournament_organizer = tournament_organizer
    @tournament_name = tournament_name
    @tournament_start_date = tournament_start_date
    @tournament_days = tournament_days
    @tournament_location = tournament_location
    system_email = ENV['EMAIL_ADDRESS']
    reply_to = contact_info.index('@') ? contact_info : system_email
    subject = @tournament_name.blank? ? 'yhteydenotto' : @tournament_name
    mail to: system_email, reply_to: reply_to, subject: "#{DOMAIN} - #{subject}"
  end

  def system_email(subject, message)
    @message = message
    mail to: ENV['EMAIL_ADDRESS'], subject: subject
  end
end
