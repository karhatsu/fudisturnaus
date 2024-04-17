class ContactMailerPreview < ActionMailer::Preview
  def without_tournament
    contact = Contact.where("tournament_name = ''").last
    ContactMailer.contact_email contact
  end

  def with_tournament
    contact = Contact.where('tournament_name is not null').last
    ContactMailer.contact_email contact
  end

  def system_email
    ContactMailer.system_email('Test email', ['Message 1', 'Message 2'].join("\n"))
  end
end
