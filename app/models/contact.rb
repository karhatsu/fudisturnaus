class Contact < ApplicationRecord
  default_scope { order(created_at: :desc) }

  validates :person_name, presence: true
  validates :email, presence: true
end
