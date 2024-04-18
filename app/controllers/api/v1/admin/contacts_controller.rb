class Api::V1::Admin::ContactsController < Api::V1::Admin::AdminBaseController
  def index
    @contacts = Contact.all
  end

  def show
    @contact = Contact.find params[:id]
  end

  def update
    @contact = Contact.find params[:id]
    @contact.update_attribute :handled_at, Time.now
  end
end
