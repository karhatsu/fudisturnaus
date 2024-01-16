class Results::ResultsController < ApplicationController
  layout 'results'

  before_action :check_results_access_key

  def index
  end

  private

  def check_results_access_key
    results_access_key = params[:results_access_key]
    @tournament = Tournament.find_by_results_access_key results_access_key
    redirect_to root_path unless @tournament
  end
end
