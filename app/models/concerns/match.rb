module Match
  extend ActiveSupport::Concern

  included do
    belongs_to :field

    validates :home_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than: 50, allow_nil: true }
    validates :away_goals, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than: 50, allow_nil: true }
    validate :verify_both_goals

    def home_won?
      home_goals && away_goals && home_goals > away_goals
    end

    def draw?
      home_goals && away_goals && home_goals == away_goals
    end

    def away_won?
      home_goals && away_goals && home_goals < away_goals
    end

    private

    def verify_both_goals
      errors.add :base, 'Molemmat maalit pitää syöttää' if !home_goals && away_goals || home_goals && !away_goals
    end
  end
end
