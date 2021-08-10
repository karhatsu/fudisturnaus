class PlayoffGroup < ApplicationRecord
  belongs_to :age_group, touch: true

  validates :name, presence: true
end
