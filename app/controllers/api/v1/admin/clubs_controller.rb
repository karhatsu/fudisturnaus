class Api::V1::Admin::ClubsController < Api::V1::Admin::AdminBaseController
  def create
    name = params[:name]
    @club = Club.where('LOWER(name) = ?', name.downcase).first_or_create(name: name)
  end
end
