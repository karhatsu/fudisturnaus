class Api::V1::TournamentsController < ApplicationController
  def index
    render json: Tournament.all, only: %i[id name start_date location], methods: [:end_date]
  end
end
