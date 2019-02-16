class Api::V1::Official::PlayoffResultsController < Api::V1::Official::OfficialBaseController
  before_action :find_and_verity_match

  def update
    if @match.update match_params
      render status: 200, json: @match.to_json
      broadcast_result
    else
      render status: 400, json: { errors: @match.errors.full_messages }
    end
  end

  private

  def find_and_verity_match
    @match = PlayoffMatch.find(params[:match_id])
    render status: 400, json: { error: 'Match not found' } unless @match
    render status: 401, body: nil if @match.tournament_id != @tournament.id
  end

  def match_params
    params.require(:match).permit(:home_goals, :away_goals, :penalties)
  end

  def broadcast_result
    ActionCable.server.broadcast(
        "results#{@tournament.id}",
        matchId: @match.id,
        type: 'PlayoffMatch',
        homeGoals: @match.home_goals,
        awayGoals: @match.away_goals,
        penalties: @match.penalties
    )
  end
end
