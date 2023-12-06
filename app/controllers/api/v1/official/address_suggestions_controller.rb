class Api::V1::Official::AddressSuggestionsController < Api::V1::Official::OfficialBaseController
  def index
    @tournaments = Tournament.where("location ILIKE '%#{params[:location]}%'").uniq {|t| t.values_at(:address, :location)}
  end
end
