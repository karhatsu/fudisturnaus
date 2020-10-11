class ContactMailerPreview < ActionMailer::Preview
  def without_tournament
    ContactMailer.contact_email('Some User', '050 123 4567', 'Hello, I am interested in the service.',
                                '', '', '', 1, '')
  end

  def with_tournament
    ContactMailer.contact_email('Some User', 'some.user@test.com', 'Hello, I am interested in the service.',
                                'Test club', 'Test tournament', '2019-07-01', 2, 'Test field')
  end
end
