Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tournaments, only: [:index]
    end
  end

  root to: 'home#index'
end
