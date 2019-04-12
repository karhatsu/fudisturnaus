class Api::V1::Official::LotteriesController < Api::V1::Official::OfficialBaseController
  def update
    teams = params[:teams]
    teams.each do |team_id, lot|
      team = @tournament.teams.find {|t| t.id == team_id.to_i}
      team.lot = lot
      team.save!
    end
    @group = Group.find params[:group_id]
  end
end
