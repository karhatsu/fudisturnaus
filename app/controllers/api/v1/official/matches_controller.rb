class Api::V1::Official::MatchesController < Api::V1::Official::OfficialBaseController
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
    @match = params[:type] === 'PlayoffMatch' ? PlayoffMatch.find(params[:id]) : GroupStageMatch.find(params[:id])
    render status: 400, json: { error: 'Match not found' } unless @match
    render status: 401, body: nil if @match.tournament_id != @tournament.id
  end

  def match_params
    params.require(:match).permit(:home_goals, :away_goals, :penalties)
  end

  def broadcast_result
    if params[:type] === 'PlayoffMatch'
      ActionCable.server.broadcast(
          "results#{@tournament.id}",
          matchId: @match.id,
          type: params[:type],
          homeGoals: @match.home_goals,
          awayGoals: @match.away_goals,
          penalties: @match.penalties
      )
    else
      group_results = @match.group.results
      ActionCable.server.broadcast(
          "results#{@tournament.id}",
          matchId: @match.id,
          type: params[:type],
          homeGoals: @match.home_goals,
          awayGoals: @match.away_goals,
          groupId: @match.group_id,
          groupResults: group_results.map do |result|
            {
                teamName: result.team_name,
                teamId: result.team_id,
                matches: result.matches,
                wins: result.wins,
                draws: result.draws,
                losses: result.losses,
                goalsFor: result.goals_for,
                goalsAgainst: result.goals_against,
                points: result.points
            }
          end
      )
    end
  end
end
