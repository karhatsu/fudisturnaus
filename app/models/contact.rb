class Contact < ApplicationRecord
  validates :person_name, presence: true
  validates :email, presence: true
end
