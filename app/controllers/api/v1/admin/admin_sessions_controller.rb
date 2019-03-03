class Api::V1::Admin::AdminSessionsController < Api::V1::Admin::AdminBaseController
  skip_before_action :check_session_key

  def create
    @session_key = AdminSession.create params[:username], params[:password]
    render status: 401, body: nil unless @session_key
  end
end
