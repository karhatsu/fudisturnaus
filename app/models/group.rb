class Group < ApplicationRecord
  belongs_to :age_group

  validates :name, presence: true
end
