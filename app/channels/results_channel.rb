class ResultsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "results#{params[:tournament_id]}"
  end
end
