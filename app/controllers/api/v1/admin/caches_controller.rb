class Api::V1::Admin::CachesController < Api::V1::Admin::AdminBaseController
  def update
    Rails.cache.clear
    render status: 204, body: nil
  end
end
