class Api::V1::Admin::AdminSessionsController < Api::V1::Admin::AdminBaseController
  def create
    @session_key = AdminSession.create params[:username], params[:password]
    return render status: 401, body: nil unless @session_key
  end
end
