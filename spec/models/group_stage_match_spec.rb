require 'rails_helper'

RSpec.describe GroupStageMatch, type: :model do
  describe '#day' do
    let(:tournament) { build :tournament, start_date: '2019-05-31', days: 3 }
    let(:age_group) { build :age_group, tournament: tournament }
    let(:group) { build :group, age_group: age_group }

    it 'returns correct day based on start time' do
      expect(build(:group_stage_match, group: group, start_time: '2019-05-31T10:00:00').day).to eql 1
      expect(build(:group_stage_match, group: group, start_time: '2019-06-01T09:30:30').day).to eql 2
      expect(build(:group_stage_match, group: group, start_time: '2019-06-02T23:30:00').day).to eql 3
    end
  end
end
