class Official::InvoicesController < Official::OfficialController
  def show
    respond_to do |format|
      format.pdf do
        render pdf: "lasku - #{@tournament.name}", layout: true
      end
    end
  end
end
