class Api::V1::TournamentsController < ApplicationController
  def index
    @tournaments = Tournament.all
  end
end
