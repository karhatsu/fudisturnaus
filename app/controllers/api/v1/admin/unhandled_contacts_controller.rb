class Api::V1::Admin::UnhandledContactsController < Api::V1::Admin::AdminBaseController
  def index
    count = Contact.where('handled_at IS NULL').count
    render json: { count: count }
  end
end
