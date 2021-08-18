module GroupResults
  def calculate_group_results(teams, playoff)
    team_group_results = teams.map { |team| team.group_results(playoff) }
    sorted_team_results = sort_teams_by_primary_rule team_group_results
    set_rankings sorted_team_results, true
    teams_with_duplicate_rankings = sorted_team_results.group_by(&:ranking).select {|_, _teams| _teams.length > 1}
    return sorted_team_results if teams_with_duplicate_rankings.empty?

    set_mutual_match_relative_points playoff, sorted_team_results, teams_with_duplicate_rankings
    sorted_team_results = sort_teams_by_all_rules sorted_team_results
    set_rankings sorted_team_results, false
    sorted_team_results
  end

  private

  def sort_teams_by_primary_rule(group_results)
    if equal_points_rule == Tournament::EQUAL_POINTS_RULE_ALL_MATCHES_FIRST
      group_results.sort do |a, b|
        [b.relative_points, a.team_name] <=> [a.relative_points, b.team_name]
      end
    else
      group_results.sort do |a, b|
        [b.points, a.team_name] <=> [a.points, b.team_name]
      end
    end
  end

  def sort_teams_by_all_rules(sorted_team_results)
    if equal_points_rule == Tournament::EQUAL_POINTS_RULE_ALL_MATCHES_FIRST
      sorted_team_results.sort do |a, b|
        [b.relative_points, b.mutual_relative_points, b.lot, a.team_name] <=>
          [a.relative_points, a.mutual_relative_points, a.lot, b.team_name]
      end
    else
      sorted_team_results.sort do |a, b|
        [b.points, b.mutual_relative_points, b.relative_points, b.lot, a.team_name] <=>
          [a.points, a.mutual_relative_points, a.relative_points, a.lot, b.team_name]
      end
    end
  end

  def set_rankings(sorted_teams, only_primary)
    prev_team_relative_points = -1
    prev_team_ranking = -1
    use_only_points = equal_points_rule == Tournament::EQUAL_POINTS_RULE_MUTUAL_MATCHES_FIRST
    sorted_teams.map.with_index do |team, index|
      if only_primary && use_only_points
        total_relative_points = team.points
      elsif only_primary
        total_relative_points = team.relative_points
      else
        total_relative_points = team.relative_points + team.mutual_relative_points + team.lot.to_i
      end
      team.ranking = total_relative_points == prev_team_relative_points ? prev_team_ranking : index + 1
      prev_team_relative_points = total_relative_points
      prev_team_ranking = team.ranking
    end
  end

  def set_mutual_match_relative_points(playoff, sorted_team_results, teams_with_duplicate_rankings)
    teams_with_duplicate_rankings.each do |_, team_results|
      selected_teams = team_results.map(&:team)
      sorted_sub_team_results = selected_teams.map{|team| team.group_results(playoff, selected_teams)}
      sorted_sub_team_results.each do |sub_team_result|
        main_team_result = sorted_team_results.find {|results| results.team_id == sub_team_result.team_id}
        main_team_result.mutual_relative_points = sub_team_result.relative_points
      end
    end
  end
end
