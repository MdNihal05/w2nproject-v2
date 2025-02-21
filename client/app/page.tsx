import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative isolate">
      <div
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Manage Your Bills with Ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Track, analyze, and manage all your bills in one place. Get
            AI-powered insights and never miss a payment again.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-500">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-32 max-w-7xl sm:mt-40">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="text-center">
              <div className="rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-800">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  Track Bills
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Easily add and manage your bills with detailed tracking and
                  categorization.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-800">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  AI Analysis
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Get smart insights about your spending patterns and
                  recommendations.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-800">
                <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                  File Storage
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Securely store and manage your bill documents and receipts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
