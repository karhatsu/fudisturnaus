class Api::V1::Official::PlayoffResultsController < Api::V1::Official::OfficialBaseController
  before_action :find_and_verity_match

  def update
    if @match.update match_params
      playoff_matches = @match.populate_next_round_playoff_matches
      render status: 200, json: @match.to_json
      broadcast_result playoff_matches
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

  def broadcast_result(playoff_matches)
    ActionCable.server.broadcast(
        "results#{@tournament.id}",
        playoffMatch: {
            id: @match.id,
            homeGoals: @match.home_goals,
            awayGoals: @match.away_goals,
            penalties: @match.penalties,
        },
        resolvedPlayoffMatches: playoff_matches.map do |match|
          {
              id: match.id,
              homeTeam: match.home_team ? {
                  id: match.home_team.id,
                  name: match.home_team.name,
                  clubId: match.home_team.club_id
              } : nil,
              awayTeam: match.away_team ? {
                  id: match.away_team.id,
                  name: match.away_team.name,
                  clubId: match.away_team.club_id
              } : nil
          }
        end
    )
  end
end
