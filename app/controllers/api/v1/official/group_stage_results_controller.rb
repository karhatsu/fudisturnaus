class Api::V1::Official::GroupStageResultsController < Api::V1::Official::OfficialBaseController
  before_action :find_and_verity_match

  def update
    if @match.update match_params
      playoff_matches = @match.populate_first_round_playoff_matches
      render status: 200, json: @match.to_json
      broadcast_result playoff_matches
    else
      render status: 400, json: { errors: @match.errors.full_messages }
    end
  end

  private

  def allow_results_access_key?
    true
  end

  def find_and_verity_match
    @match = GroupStageMatch.find(params[:match_id])
    render status: 400, json: { error: 'Match not found' } unless @match
    render status: 401, body: nil if @match.tournament_id != @tournament.id
  end

  def match_params
    params.require(:match).permit(:home_goals, :away_goals)
  end

  def broadcast_result(playoff_matches)
    group_results = @match.group.results
    ActionCable.server.broadcast(
        "results#{@tournament.id}",
        { groupId: @match.group_id,
          groupStageMatch: {
            id: @match.id,
            homeGoals: @match.home_goals,
            awayGoals: @match.away_goals,
          },
          groupResults: group_results.map do |result|
            {
              ranking: result.ranking,
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
          end,
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
        }
    )
  end
end
