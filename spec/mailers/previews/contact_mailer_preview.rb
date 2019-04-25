class ContactMailerPreview < ActionMailer::Preview
  def contact_email
    tournament = Tournament.last
    ContactMailer.contact_email('Some User', 'some.user@test.com', 'Hello, I am interested in the service.', tournament)
  end
end
