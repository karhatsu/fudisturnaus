class AddDatesToTournaments < ActiveRecord::Migration[8.0]
  def up
    add_column :tournaments, :dates, :jsonb
    Tournament.all.each do |t|
      if t.days == 0
        t.update_attribute :dates, find_unique_dates(t)
      else
        t.update_attribute :dates, t.days.times.map {|i| t.start_date + i}
      end
    end
    change_column_null :tournaments, :dates, false
  end

  def down
    remove_column :tournaments, :dates
  end

  def find_unique_dates(tournament)
    dates = [tournament.start_date]
    tournament.age_groups.each do |ag|
      ag.groups.each do |g|
        g.group_stage_matches.each do |match|
          dates << match.start_time.to_date
        end
      end
      ag.playoff_matches.each do |match|
        dates << match.start_time.to_date
      end
    end
    dates.uniq.sort
  end
end
