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
    return render status: 400, json: { error: 'Match not found' } unless @match
    return render status: 401, body: nil if @referee && @match.referee_id != @referee.id
    render status: 401, body: nil if @match.tournament_id != @tournament.id
  end

  def match_params
    params.require(:match).permit(:home_goals, :away_goals)
  end

  def broadcast_result(playoff_matches)
    group_results = @match.group.results
    playoff_groups = playoff_matches.select {|m| m.playoff_group_id}.map {|m| m.playoff_group}.uniq
    ActionCable.server.broadcast(
        "results#{@tournament.id}",
        { groupId: @match.group_id,
          groupStageMatch: {
            type: 'group',
            id: @match.id,
            ageGroup: @match.group.age_group.name,
            homeClubLogoUrl: @match.home_team.club&.logo_url,
            homeTeam: @match.home_team.name,
            homeGoals: @match.home_goals,
            awayClubLogoUrl: @match.away_team.club&.logo_url,
            awayTeam: @match.away_team.name,
            awayGoals: @match.away_goals,
          },
          groupResults: group_results.map do |result|
            {
              ranking: result.ranking,
              teamName: result.team_name,
              teamId: result.team_id,
              clubId: result.club_id,
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
          end,
          playoffGroups: playoff_groups.map do |playoff_group|
            {
              id: playoff_group.id,
              results: playoff_group.results.map do |result|
                {
                  ranking: result.ranking,
                  teamName: result.team_name,
                  teamId: result.team_id,
                  clubId: result.club_id,
                  matches: result.matches,
                  wins: result.wins,
                  draws: result.draws,
                  losses: result.losses,
                  goalsFor: result.goals_for,
                  goalsAgainst: result.goals_against,
                  points: result.points
                }
              end
            }
          end
        }
    )
  end
end
