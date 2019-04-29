class Api::V1::Public::ContactsController < ApplicationController
  protect_from_forgery with: :null_session, only: Proc.new { |c| c.request.format.json? }

  def create
    ContactMailer.contact_email(params[:name], params[:contact_info], params[:message], nil).deliver_later
    render status: 201, body: nil
  end
end
