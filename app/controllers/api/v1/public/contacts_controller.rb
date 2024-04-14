class Api::V1::Public::ContactsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def create
    contact = Contact.new contact_params
    if contact.save
      ContactMailer.contact_email(contact).deliver_later
      render status: 201, body: nil
    else
      render status: 400, body: { error: contact.errors.messages }
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:person_name, :email, :message, :tournament_club, :tournament_name, :tournament_start_date, :tournament_days, :tournament_location)
  end
end
